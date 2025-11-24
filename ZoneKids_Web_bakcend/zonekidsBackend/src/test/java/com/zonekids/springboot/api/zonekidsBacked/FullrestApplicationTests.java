package com.zonekids.springboot.api.zonekidsBacked;

import com.zonekids.springboot.api.zonekidsBackend.FullrestApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = FullrestApplication.class)
class FullrestApplicationTests {

	@Test
	void contextLoads() {
		assertTrue(true);
	}

}
